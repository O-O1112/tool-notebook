# API 規格文件 (API Specification)

## 基礎資訊
- **Base URL**: `/api`
- **認證方式**: HTTP Authorization Header `Bearer <JWT_TOKEN>`

---

## 1. 身分驗證 (Authentication)

### 1.1 使用者註冊
- **URL**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "username": "teacher_wang",
    "password": "securepassword",
    "displayName": "王老師",
    "role": "teacher" // "teacher" | "student"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "username": "teacher_wang",
      "displayName": "王老師",
      "role": "teacher"
    }
  }
  ```

### 1.2 使用者登入
- **URL**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "teacher_wang",
    "password": "securepassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "username": "teacher_wang",
      "displayName": "王老師",
      "role": "teacher"
    }
  }
  ```

### 1.3 取得當前使用者身分
- **URL**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "id": 1,
      "username": "teacher_wang",
      "displayName": "王老師",
      "role": "teacher"
    }
  }
  ```

### 1.4 一鍵示範帳號登入 (Demo Login)
- **URL**: `POST /api/auth/demo`
- **Request Body**:
  ```json
  {
    "role": "teacher" // 或 "student"
  }
  ```

---

## 2. 空間管理 (Workspaces / Spaces)

### 2.1 取得使用者的所有空間
- **URL**: `GET /api/spaces`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "課堂教學空間 A",
      "description": "數學與物理小工具",
      "layout": "grid", // "grid" | "tabs"
      "isPublic": 0,
      "createdAt": "2026-09-10T12:00:00.000Z",
      "toolCount": 3
    }
  ]
  ```

### 2.2 建立新空間
- **URL**: `POST /api/spaces`
- **Request Body**:
  ```json
  {
    "name": "新教學空間",
    "description": "幾何與計算工具",
    "layout": "grid"
  }
  ```

### 2.3 取得單一空間及其所有工具
- **URL**: `GET /api/spaces/:id`
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "name": "課堂教學空間 A",
    "layout": "grid",
    "tools": [
      {
        "id": 101,
        "title": "互動圖形計算機",
        "type": "iframe", // "html" | "iframe" | "url"
        "content": "<iframe src='...'></iframe>",
        "sortOrder": 0
      }
    ]
  }
  ```

### 2.4 新增工具至空間
- **URL**: `POST /api/spaces/:id/tools`
- **Request Body**:
  ```json
  {
    "title": "自訂小程式",
    "type": "html",
    "content": "<button onclick=\"alert('Hi')\">點我</button>"
  }
  ```

### 2.5 刪除工具
- **URL**: `DELETE /api/spaces/:id/tools/:toolId`
