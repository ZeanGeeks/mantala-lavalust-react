<?php

defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class AuthController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->call->library('api');
        $this->call->database();
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/login
    |--------------------------------------------------------------------------
    */

    public function login()
    {
        $this->api->require_method('POST');

        $input = $this->api->body();

        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        if (!$username || !$password) {
            $this->api->respond_error(
                'Username and password are required.',
                400
            );
        }

        $stmt = $this->db->raw(
            'SELECT id, username, email, password, role
             FROM users
             WHERE username = ?',
            [$username]
        );

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {
            $this->api->respond_error(
                'Invalid username or password.',
                401
            );
        }

        $tokens = $this->api->issue_tokens([
            'id' => $user['id'],
            'role' => $user['role'] ?? 'user'
        ]);

        $this->api->respond([
            'success' => true,
            'message' => 'Login successful.',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'] ?? null,
                'role' => $user['role'] ?? 'user'
            ],
            'tokens' => $tokens
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/logout
    |--------------------------------------------------------------------------
    */

    public function logout()
    {
        $this->api->require_method('POST');

        $input = $this->api->body();

        $this->api->revoke_refresh_token(
            $input['refresh_token'] ?? ''
        );

        $this->api->respond([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/refresh
    |--------------------------------------------------------------------------
    */

    public function refresh()
    {
        $this->api->require_method('POST');

        $input = $this->api->body();
        $refreshToken = $input['refresh_token'] ?? '';

        if ($refreshToken === '') {
            $this->api->respond_error(
                'Refresh token is required.',
                400
            );
        }

        $this->api->refresh_access_token($refreshToken);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/profile
    |--------------------------------------------------------------------------
    */

    public function profile()
    {
        $auth = $this->api->require_jwt();

        $stmt = $this->db->raw(
            'SELECT id, username, email, role, created_at
             FROM users
             WHERE id = ?',
            [$auth['sub']]
        );

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $this->api->respond_error(
                'User not found.',
                404
            );
        }

        $this->api->respond($user);
    }
}