import os

from azure.data.tables import TableClient
from azure.core.exceptions import ResourceExistsError


def setup_session_table():
    table_name = os.environ.get("SESSION_TABLE_NAME")
    conn_str = os.environ.get("SESSION_CONN_STR")

    with TableClient.from_connection_string(
        conn_str=conn_str, table_name=table_name
    ) as table_client:

        try:
            table_client.create_table()
            print(f"Created table_name: {table_name}")
        except ResourceExistsError:
            print(f"{table_name} already exists")


if __name__ == "__main__":
    setup_session_table()
