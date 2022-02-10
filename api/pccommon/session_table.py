import json
import logging
import os

from datetime import datetime
from typing import Any, cast

from azure.data.tables import TableClient, UpdateMode, TableEntity
from azure.core.exceptions import ResourceExistsError


PKEY = "sessions"


class SessionTable:
    def __init__(self):
        self.table_name = os.environ.get("SESSION_TABLE_NAME")
        self.conn_str = os.environ.get("SESSION_CONN_STR")

    def get_session_data(self, session_id: str) -> TableEntity:
        return self.client.get_entity(partition_key=PKEY, row_key=session_id)

    def set_session_data(self, session_id: str, session_data: dict, encoded_jwt: dict):
        expires = datetime.fromtimestamp(cast(float, session_data.get("exp")))
        email = session_data.get("email")

        entity = {
            "PartitionKey": PKEY,
            "RowKey": session_id,
            "token": json.dumps(encoded_jwt),
            "expires": expires,
            "email": email,
        }

        self.client.upsert_entity(mode=UpdateMode.REPLACE, entity=entity)

    def delete_session_data(self, session_id: str) -> None:
        try:
            self.client.delete_entity(partition_key=PKEY, row_key=session_id)

        except ResourceExistsError:
            logging.exception("Unable to delete session data")

    def __enter__(self):
        self.client = TableClient.from_connection_string(
            conn_str=self.conn_str, table_name=self.table_name
        )
        return self

    def __exit__(self, *args: Any) -> None:
        if self.client:
            self.client.close()
