import argparse
from trustx.logger import log
from trustx.api.client import TrustXClient, TrustXError


def export(args: argparse.Namespace) -> int:
    """
    Handles the 'export' subcommand logic.
    """

    if args.gui:
        from .gui import ExportApp

        app = ExportApp()
        app.run()
    else:
        example_usage()

        # name = args.username
        # if args.apikey:
        #     message = f"EXPORT, {name.upper()}!"
        # else:
        #     message = f"export, {name}."

        # log(message)

    return 0  # Success


# Example usage and testing functions
def example_usage():
    """
    Example usage of the TrustX client library.
    """
    # Initialize client
    client = TrustXClient(base_url="https://deloittesandbox.gum.trustx.com", api_key="D5TCOG34LW5E6WJBMUKLDBOFMM.267C8D459D4BC6797A2BF53ED9B8385D")

    try:
        # Get bearer token
        token_info = client.get_bearer_token()
        log(f"Token obtained, TTL: {token_info['ttl']} seconds")

        # List existing API keys
        api_keys_response = client.list_api_keys()
        log(f"Found {api_keys_response['totalElements']} API keys")

        # Create a new API key
        # new_key_data = {"name": "Test API Key", "description": "Created by Python client", "status": "ACTIVE", "permissions": ["read", "write"], "type": "SESSION"}

        # new_key = client.create_api_key(new_key_data)
        # log(f"Created new API key: {new_key['name']}")

        # Get details of the new key
        key_details = client.get_api_key(api_keys_response["content"][0]["id"])
        log(f"Key details: {key_details['name']} - {key_details['status']}")

        # Update the key
        client.create_process_token(
            name="XK559925008900703002",
            status="ACTIVE",
            type="MULTI_USE_TIME_LIMITED",
            tenantId="deloittesandbox",
            description="User-friendly 24 hour pricing structure",
            processDefnName="TrustX_Registration_Rzemieniuk",
            processDefnVersion="1",
            uiUrl="https://deloittesandbox.gum.trustx.com/web/trustweb",
            email="alex@rzem.com",
            redirectUrl="https://www.daon.com",
        )
        # updated_key = client.update_api_key(api_keys_response["content"][0]["id"], {"description": "Updated by Python client"})
        log(f"create_process_token")

        # Delete the key (uncomment if you want to test deletion)
        # client.delete_api_key(new_key['id'])
        # print("API key deleted")

    except TrustXError as e:
        log(f"TrustX API Error: {e}")
        if e.response_data:
            log(f"Error details: {e.response_data}")
    finally:
        client.close()
