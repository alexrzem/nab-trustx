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
    
    client = TrustXClient(base_url="https://deloittesandbox.gum.trustx.com", api_key="BQFTWJU3JEBT6M6P3T47ZERC5U.9186CD59A69CA4F783877104033A2665")

    try:
        # Get bearer token
        token_info = client.get_bearer_token()
        log(f"Token obtained, TTL: {token_info['ttl']} seconds")

        


    except TrustXError as e:
        log(f"TrustX API Error: {e}")
        if e.response_data:
            log(f"Error details: {e.response_data}")
    finally:
        client.close()
