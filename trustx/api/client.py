"""
TrustX Python Client Library
============================

A Python client library for Daon's TrustX Identity Verification platform.

Installation:
    pip install requests

Usage:
    from trustx_client import TrustXClient

    client = TrustXClient(base_url="https://api.trustx.com", api_key="your-api-key")

    # Get bearer token
    token_response = client.get_bearer_token()

    # List API keys
    api_keys = client.list_api_keys()

    # Create new API key
    new_key = client.create_api_key({
        "name": "My API Key",
        "description": "Development key",
        "permissions": ["read", "write"]
    })
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union
from datetime import datetime
from trustx.logger import log
from faker import Faker

class TrustXError(Exception):
    """Base exception for TrustX client errors."""

    def __init__(self, message: str, status_code: Optional[int] = None, response_data: Optional[Dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data


class TrustXAPIError(TrustXError):
    """Exception for API-related errors."""

    pass


class TrustXAuthenticationError(TrustXError):
    """Exception for authentication-related errors."""

    pass


class TrustXClient:
    """
    TrustX API Client for identity verification platform.

    This client provides methods to interact with the TrustX API for managing
    API keys and authentication tokens.

    Attributes:
        base_url (str): The base URL for the TrustX API
        api_key (str): The API key for authentication
        session (requests.Session): HTTP session for making requests
        bearer_token (str): Bearer token for authenticated requests
    """

    def __init__(self, base_url: str, api_key: str, timeout: int = 30):
        """
        Initialize the TrustX client.

        Args:
            base_url (str): The base URL for the TrustX API (e.g., "https://api.trustx.com")
            api_key (str): Your TrustX API key
            timeout (int): Request timeout in seconds (default: 30)
        """
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout
        self.bearer_token: Optional[str] = None
        self.session = requests.Session()

        # Set default headers
        self.session.headers.update({"Accept": "application/json", "User-Agent": "TrustX-Python-Client/1.0.0"})

    def _make_request(self, method: str, endpoint: str, use_bearer_auth: bool = True, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict:
        """
        Make an HTTP request to the TrustX API.

        Args:
            method (str): HTTP method (GET, POST, DELETE, etc.)
            endpoint (str): API endpoint path
            use_bearer_auth (bool): Whether to use bearer token authentication
            data (Dict, optional): Request body data
            params (Dict, optional): Query parameters

        Returns:
            Dict: Response JSON data

        Raises:
            TrustXAuthenticationError: If authentication fails
            TrustXAPIError: If API request fails
        """
        url = f"{self.base_url}{endpoint}"
        log(f"url: {str(url)}")

        # Set authentication headers
        if use_bearer_auth:
            if not self.bearer_token:
                raise TrustXAuthenticationError("Bearer token not available. Call get_bearer_token() first.")

            self.session.headers.update({"Authorization": f"Bearer {self.bearer_token}"})
            # Remove X-Api-Key header if present
            self.session.headers.pop("X-Api-Key", None)
        else:
            self.session.headers.update({"X-Api-Key": self.api_key})
            # Remove Authorization header if present
            self.session.headers.pop("Authorization", None)

        self.session.headers.pop("Accept-Encoding", None)

        try:
            response = self.session.request(method=method, url=url, json=data, params=params, timeout=self.timeout)

            # Handle different response status codes
            if response.status_code == 401:
                error_data = response.json() if response.content else {}
                log(f"Authentication failed: {error_data.get('message', 'Unauthorized')}")
                raise TrustXAuthenticationError(f"Authentication failed: {error_data.get('message', 'Unauthorized')}", status_code=response.status_code, response_data=error_data)
            elif response.status_code == 400:
                error_data = response.json() if response.content else {}
                log(f"Bad request: {error_data.get('message', 'Invalid request')}")
                raise TrustXAPIError(f"Bad request: {error_data.get('message', 'Invalid request')}", status_code=response.status_code, response_data=error_data)
            elif not response.ok:
                error_data = response.json() if response.content else {}
                log(f"API request failed: {error_data.get('message', response.reason)}")
                raise TrustXAPIError(f"API request failed: {error_data.get('message', response.reason)}", status_code=response.status_code, response_data=error_data)

            # Handle empty responses (like DELETE operations)
            if response.status_code == 204:
                log(f"Expty response: {response.status_code}")
                return {}

            return response.json() if response.content else {}

        except requests.RequestException as e:
            log(f"Network error: {str(e)}")
            raise TrustXAPIError(f"Network error: {str(e)}")

    def get_bearer_token(self) -> Dict[str, Union[str, int]]:
        """
        Obtain a bearer token using the API key.

        Returns:
            Dict: Token response containing 'token' and 'ttl' fields

        Raises:
            TrustXAuthenticationError: If token generation fails

        Example:
            >>> client = TrustXClient(base_url="https://api.trustx.com", api_key="your-key")
            >>> token_info = client.get_bearer_token()
            >>> print(f"Token expires in {token_info['ttl']} seconds")
        """
        log(f"get_bearer_token: {self.api_key}")
        response = self._make_request("POST", "/api/arthr/apiKeys/issue", use_bearer_auth=False)

        if "token" in response:
            self.bearer_token = response["token"]
            log(f"Bearer token obtained, expires in {response.get('ttl', 'unknown')} seconds")

        with open("bearer.txt", "w") as f:
            f.write(f"{self.bearer_token}")

        return response

    def list_api_keys(self, name: Optional[str] = None, page: int = 0, size: int = 10, sort: Optional[List[str]] = None) -> Dict:
        """
        List API keys for the tenant.

        Args:
            name (str, optional): Filter by API key name (supports wildcards)
            page (int): Page number for pagination (default: 0)
            size (int): Number of items per page (default: 10)
            sort (List[str], optional): Sort criteria (e.g., ['name,asc', 'createdDtm,desc'])

        Returns:
            Dict: Paginated list of API keys

        Example:
            >>> api_keys = client.list_api_keys(name="prod%", size=20)
            >>> for key in api_keys['content']:
            ...     print(f"Key: {key['name']}, Status: {key['status']}")
        """
        params = {"page": page, "size": size}

        # if name:
        #     params["name"] = name
        # if sort:
        #     params["sort"] = ",".join(sort)

        return self._make_request("GET", "/api/arthr/apiKeys", params=params)

    def get_api_key(self, api_key_id: str) -> Dict:
        """
        Get details of a specific API key.

        Args:
            api_key_id (str): The ID of the API key to retrieve

        Returns:
            Dict: API key details

        Example:
            >>> key_details = client.get_api_key("key-id-123")
            >>> print(f"Key name: {key_details['name']}")
        """
        return self._make_request("GET", f"/api/arthr/apiKeys/{api_key_id}")

    def create_api_key(self, key_data: Dict) -> Dict:
        """
        Create a new API key for the tenant.

        Args:
            key_data (Dict): API key configuration data

        Required fields in key_data:
            - name (str): Name of the API key

        Optional fields:
            - description (str): Description of the API key
            - permissions (List[str]): List of permissions
            - permittedOperations (List[str]): List of permitted operations
            - status (str): Status ('ACTIVE', 'BLOCKED', 'ARCHIVED')
            - type (str): Type ('SESSION', 'PERMANENT')
            - expiringDtm (str): Expiration datetime (ISO format)

        Returns:
            Dict: Created API key details

        Example:
            >>> new_key = client.create_api_key({
            ...     "name": "Production API Key",
            ...     "description": "Key for production environment",
            ...     "permissions": ["read", "write"],
            ...     "status": "ACTIVE"
            ... })
        """
        return self._make_request("POST", "/api/arthr/apiKeys", data=key_data)

    def update_api_key(self, api_key_id: str, key_data: Dict) -> Dict:
        """
        Update an existing API key.

        Args:
            api_key_id (str): The ID of the API key to update
            key_data (Dict): Updated API key data

        Returns:
            Dict: Updated API key details

        Example:
            >>> updated_key = client.update_api_key("key-id-123", {
            ...     "name": "Updated Key Name",
            ...     "status": "BLOCKED"
            ... })
        """
        return self._make_request("POST", f"/api/arthr/apiKeys/{api_key_id}", data=key_data)

    def delete_api_key(self, api_key_id: str) -> bool:
        """
        Delete an API key. Once deleted, it cannot be recovered.

        Args:
            api_key_id (str): The ID of the API key to delete

        Returns:
            bool: True if deletion was successful

        Example:
            >>> success = client.delete_api_key("key-id-123")
            >>> if success:
            ...     print("API key deleted successfully")
        """
        response = self._make_request("DELETE", f"/api/arthr/apiKeys/{api_key_id}")
        return True  # If no exception was raised, deletion was successful

    def create_process_token(
        self,
        name: str,
        status: Optional[str] = "ACTIVE",
        type: Optional[str] = "MULTI_USE_COUNT_LIMITED",
        tenantId: Optional[str] = None,
        description: Optional[str] = None,
        processDefnName: Optional[str] = None,
        processDefnVersion: Optional[str] = None,
        maxCount: Optional[str] = "1",
        # notAfterDtm: Optional[str] = None,
        # notBeforeDtm: Optional[str] = None,
        uiUrl: Optional[str] = None,
        email: Optional[str] = None,
        redirectUrl: Optional[str] = None,
    ) -> Dict:
        """
        Create Process Token

        Args:
            api_key_id (str): The ID of the API key to delete
            {
                "name": "{{$randomBankAccountIban}}",
                "status": "ACTIVE",
                "type": "MULTI_USE_COUNT_LIMITED",
                "tenantId": "{{tenantId}}",
                "description": "{{$randomCatchPhrase}}",
                "processDefnName": "{{processDefnName}}",
                "processDefnVersion": "{{processDefnVersion}}",
                "maxCount": "1",
                "notAfterDtm": "2023-12-07T15:45:25.000Z",
                "notBeforeDtm": "2023-09-22T13:45:25.971Z",
                "uiUrl": "{{baseUrl}}/web/trustweb",
                "parameters": {
                    "email": "alex@rzem.com",
                    "_redirectUrl": "{{redirectUrl}}"
                }
            }

        Returns:
            bool: True if deletion was successful

        Example:
            >>> success = client.create_process_token("key-id-123")
            >>> if success:
            ...     print("API key deleted successfully")
        """

        data = {
            "name": name,
            "status": status,
            "type": type,
            "tenantId": tenantId,
            "description": description,
            "processDefnName": processDefnName,
            "processDefnVersion": processDefnVersion,
            "uiUrl": uiUrl,
            "parameters": {"email": email, "_redirectUrl": redirectUrl},
        }

        if type == "MULTI_USE_COUNT_LIMITED":
            data["maxCount"] = maxCount
        elif type == "MULTI_USE_TIME_LIMITED":
            instant = datetime.now()
            notAfterDtm = instant + timedelta(hours=5)
            notBeforeDtm = instant - timedelta(hours=5)

            data["notAfterDtm"] = notAfterDtm.strftime("%Y-%m-%dT%H:%M:%S.000Z")  # "2023-12-07T15:45:25.000Z"
            data["notBeforeDtm"] = notBeforeDtm.strftime("%Y-%m-%dT%H:%M:%S.000Z")  # "2023-09-22T13:45:25.971Z"
        elif type == "UNLIMITED":
            pass

        self.session.headers.update({"Content-Type": "application/json"})

        response = self._make_request(method="POST", endpoint="/api/process-manager/processTokens", data=data)

        return response

    def close(self):
        """Close the HTTP session."""
        self.session.close()

    def __enter__(self):
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()


# Convenience classes for API key management
class APIKey:
    """
    Represents a TrustX API Key with helper methods.
    """

    def __init__(self, client: TrustXClient, data: Dict):
        self.client = client
        self._data = data

    @property
    def id(self) -> str:
        return self._data.get("id", "")

    @property
    def name(self) -> str:
        return self._data.get("name", "")

    @property
    def status(self) -> str:
        return self._data.get("status", "")

    @property
    def permissions(self) -> List[str]:
        return self._data.get("permissions", [])

    @property
    def created_date(self) -> Optional[datetime]:
        created_dtm = self._data.get("createdDtm")
        if created_dtm:
            return datetime.fromisoformat(created_dtm.replace("Z", "+00:00"))
        return None

    def update(self, **kwargs) -> "APIKey":
        """Update this API key with new data."""
        updated_data = self._data.copy()
        updated_data.update(kwargs)
        response = self.client.update_api_key(self.id, updated_data)
        return APIKey(self.client, response)

    def delete(self) -> bool:
        """Delete this API key."""
        return self.client.delete_api_key(self.id)

    def __repr__(self):
        return f"APIKey(id='{self.id}', name='{self.name}', status='{self.status}')"


# Example usage and testing functions
def example_usage():
    """
    Example usage of the TrustX client library.
    """
    # Initialize client
    fake = Faker()
    client = TrustXClient(base_url="https://api.trustx.com", api_key="your-api-key-here")

    try:
        # Get bearer token
        token_info = client.get_bearer_token()
        log(f"Token obtained, TTL: {token_info['ttl']} seconds")

        # List existing API keys
        api_keys_response = client.list_api_keys()
        log(f"Found {api_keys_response['totalElements']} API keys")

        # Create a new API key
        new_key_data = {"name": "Test API Key", "description": "Created by Python client", "status": "ACTIVE", "permissions": ["read", "write"], "type": "SESSION"}

        new_key = client.create_api_key(new_key_data)
        log(f"Created new API key: {new_key['name']}")

        # Get details of the new key
        key_details = client.get_api_key(new_key["id"])
        log(f"Key details: {key_details['name']} - {key_details['status']}")

        # Update the key
        updated_key = client.update_api_key(new_key["id"], {"description": "Updated by Python client"})
        log(f"Updated key description")

        # Update the key
        client.create_process_token(
            name=fake.iban(),
            status="ACTIVE",
            type="MULTI_USE_TIME_LIMITED",
            tenantId="deloittesandbox",
            description=fake.sentence(nb_words=5),
            processDefnName="TrustX_Registration_Rzemieniuk",
            processDefnVersion="1",
            uiUrl="https://deloittesandbox.gum.trustx.com/web/trustweb",
            email=fake.email(),
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


if __name__ == "__main__":
    # Run example (replace with your actual API credentials)
    # example_usage()
    pass
