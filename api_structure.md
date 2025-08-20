# API Structure

## Admin Routes

### GET /admin/agents

*   **Description:** Retrieves all agents
*   **Request Parameters:** None
*   **Response:**
    *   **Status Code:** 200 OK
    *   **Content:**
        ```json
        {
            "success": true,
            "data": [
                {
                    "_id": "agentId",
                    "chatAgentName": "Agent Name",
                    "systemPrompt": "System Prompt",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp",
                    "__v": 0
                }
            ]
        }
        ```
    *   **Error:**
        *   **Status Code:** 400 Bad Request
        *   **Content:**
            ```json
            {
                "success": false,
                "error": "Error message"
            }
            ```

### GET /admin/sessions/:agentId

*   **Description:** Retrieves all sessions for a specific agent.
*   **Request Parameters:**
    *   `agentId` (path parameter): The ID of the agent.
*   **Response:**
    *   **Status Code:** 200 OK
    *   **Content:**
        ```json
        {
            "success": true,
            "data": [
                {
                    "_id": "sessionId",
                    "agent": "agentId",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp",
                    "__v": 0
                }
            ]
        }
        ```
    *   **Error:**
        *   **Status Code:** 400 Bad Request
        *   **Content:**
            ```json
            {
                "success": false,
                "error": "Error message"
            }
            ```

### GET /admin/session/:sessionId

*   **Description:** Retrieves the chat history for a specific session.
*   **Request Parameters:**
    *   `sessionId` (path parameter): The ID of the session.
*   **Response:**
    *   **Status Code:** 200 OK
    *   **Content:**
        ```json
        {
            "success": true,
            "data": [
                {
                    "_id": "messageId",
                    "session": "sessionId",
                    "role": "user/assistant",
                    "content": "Message content",
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp",
                    "__v": 0
                }
            ]
        }
        ```
    *   **Error:**
        *   **Status Code:** 400 Bad Request
        *   **Content:**
            ```json
            {
                "success": false,
                "error": "Error message"
            }
            ```

## Agents Routes

### POST /agents

*   **Description:** Creates a new agent.
*   **Request Parameters:**
    *   **Body:**
        ```json
        {
            "chatAgentName": "Agent Name",
            "systemPrompt": "System Prompt"
        }
        ```
*   **Response:**
    *   **Status Code:** 201 Created
    *   **Content:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "agentId",
                "chatAgentName": "Agent Name",
                "systemPrompt": "System Prompt",
                "createdAt": "timestamp",
                "updatedAt": "timestamp",
                "__v": 0
            }
        }
        ```
    *   **Error:**
        *   **Status Code:** 400 Bad Request
        *   **Content:**
            ```json
            {
                "success": false,
                "error": "Error message"
            }
            ```

## Sessions Routes

### POST /sessions/:agentId

*   **Description:** Creates a new session for a specific agent.
*   **Request Parameters:**
    *   `agentId` (path parameter): The ID of the agent.
*   **Response:**
    *   **Status Code:** 201 Created
    *   **Content:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "sessionId",
                "agent": "agentId",
                "createdAt": "timestamp",
                "updatedAt": "timestamp",
                "__v": 0
            }
        }
        ```
    *   **Error:**
        *   **Status Code:** 400 Bad Request
        *   **Content:**
            ```json
            {
                "success": false,
                "error": "Error message"
            }
            ```

### POST /sessions/:sessionId/messages

*   **Description:** Creates a new message for a specific session.
*   **Request Parameters:**
    *   `sessionId` (path parameter): The ID of the session.
    *   **Body:**
        ```json
        {
            "role": "user/assistant",
            "content": "Message content"
        }
        ```
*   **Response:**
    *   **Status Code:** 201 Created
    *   **Content:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "messageId",
                "session": "sessionId",
                "role": "user/assistant",
                "content": "Message content",
                "createdAt": "timestamp",
                "updatedAt": "timestamp",
                "__v": 0
            }
        }
        ```
    *   **Error:**
        *   **Status Code:** 400 Bad Request
        *   **Content:**
            ```json
            {
                "success": false,
                "error": "Error message"
            }