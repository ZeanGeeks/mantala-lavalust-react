<?php

defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class Create_products_table
{
    protected $lava;

    public function __construct()
    {
        $this->lava =& lava_instance();
    }

    public function up()
    {
        $this->lava->call->dbforge();

        $this->lava->dbforge->add_field([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => TRUE,
                'auto_increment' => TRUE
            ],

            'product_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 100
            ],

            'description' => [
                'type' => 'TEXT',
                'null' => TRUE
            ],

            'price' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2'
            ],

            'quantity' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0
            ],

            'created_at' => [
                'type'    => 'TIMESTAMP',
                'default' => 'CURRENT_TIMESTAMP'
            ]
        ]);

        $this->lava->dbforge->add_key('id', TRUE);

        $this->lava->dbforge->create_table('products');
    }

    public function down()
    {
        $this->lava->call->dbforge();

        $this->lava->dbforge->drop_table('products');
    }
}