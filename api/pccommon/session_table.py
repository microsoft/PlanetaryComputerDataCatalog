import os


class SessionTable:
    def __init__(self):
        self.account_name = os.environ.get("sessionStorageAccountName")
        self.conn_str = os.environ.get("sessionTableConnectionString")

    def get_session(self, session_id: str):
        pass

    def set_session(self, session_id: str, session_data: dict):
        pass
