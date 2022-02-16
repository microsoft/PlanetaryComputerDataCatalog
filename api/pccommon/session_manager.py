from datetime import datetime
from http.cookies import SimpleCookie
from typing import Optional

import azure.functions as func

from .auth import SESSION_COOKIE
from .session_table import SessionTable


class InvalidSessionCookie(Exception):
    pass


class SessionManager:
    def __init__(self, req: func.HttpRequest):
        cookie_reader: SimpleCookie = SimpleCookie()
        cookie_header = req.headers.get("Cookie")

        if cookie_header == None:
            raise InvalidSessionCookie("No cookie header found")

        cookie_reader.load(cookie_header)
        session_cookie = cookie_reader.get(SESSION_COOKIE)

        if session_cookie == None:
            raise InvalidSessionCookie()

        self.session_id = None
        self.session_data = {}

        if session_cookie:
            self.session_id = session_cookie.value
            with SessionTable() as client:
                self.session_data = client.get_session_data(self.session_id)

    @property
    def id_token(self) -> Optional[str]:
        return self.session_data.get("token")

    @property
    def email(self) -> Optional[str]:
        return self.session_data.get("email")

    @property
    def expires(self) -> Optional[datetime]:
        return self.session_data.get("expires")

    def destroy(self) -> None:
        with SessionTable() as client:
            client.delete_session_data(self.session_id)
