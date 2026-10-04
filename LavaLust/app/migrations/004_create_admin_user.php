<?php

defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class Create_admin_user
{
    private $_lava;

    public function __construct()
    {
        $this->_lava = lava_instance();
        $this->_lava->call->database();
    }

    public function up()
    {
        $username = trim((string) getenv('ADMIN_USERNAME'));
        $email = trim((string) getenv('ADMIN_EMAIL'));
        $password = (string) getenv('ADMIN_PASSWORD');

        if ($username === '' || $email === '' || $password === '') {
            throw new RuntimeException(
                'ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured before migrations run.'
            );
        }

        if (strlen($password) < 12) {
            throw new RuntimeException('ADMIN_PASSWORD must contain at least 12 characters.');
        }

        $existing = $this->_lava->db->raw(
            'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
            [$username, $email]
        )->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            return;
        }

        $this->_lava->db->raw(
            'INSERT INTO users (username, email, password, role, is_active)
             VALUES (?, ?, ?, ?, ?)',
            [
                $username,
                $email,
                password_hash($password, PASSWORD_DEFAULT),
                'admin',
                1
            ]
        );
    }

    public function down()
    {
        $username = trim((string) getenv('ADMIN_USERNAME'));

        if ($username === '') {
            return;
        }

        $this->_lava->db->raw(
            'DELETE FROM users WHERE username = ?',
            [$username]
        );
    }
}
