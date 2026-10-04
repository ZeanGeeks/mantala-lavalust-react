<?php

defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');

class ProductController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->call->model('ProductModel');
        $this->call->library('api');
        $this->call->database();
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/products
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $this->api->require_method('GET');

        $this->api->require_jwt();

        $products = $this->ProductModel->all();

        $this->api->respond([
            'success' => true,
            'products' => $products
        ]);
    }

    public function show($id)
    {
        $this->api->require_method('GET');
        $this->api->require_jwt();

        $product = $this->ProductModel->find((int) $id);

        if (!$product) {
            $this->api->respond_error('Product not found.', 404);
        }

        $this->api->respond([
            'success' => true,
            'product' => $product
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/products
    |--------------------------------------------------------------------------
    */

    public function store()
    {
        $this->api->require_method('POST');

        $auth = $this->api->require_jwt();

        $input = $this->api->body();

        if (
            empty($input['product_name']) ||
            !isset($input['price']) ||
            !isset($input['quantity'])
        ) {
            $this->api->respond_error(
                'Product name, price and quantity are required.',
                400
            );
        }

        $data = [
            'product_name' => $input['product_name'],
            'description'  => $input['description'] ?? '',
            'price'        => $input['price'],
            'quantity'     => $input['quantity']
        ];

        $id = $this->ProductModel->insert($data);

        if (!$id) {
            $this->api->respond_error(
                'Failed to create product.',
                500
            );
        }

        $this->api->respond([
            'success' => true,
            'message' => 'Product created successfully.',
            'id' => $id
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | PUT /api/products/{id}
    |--------------------------------------------------------------------------
    */

    public function update($id)
    {
        if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'PATCH'], true)) {
            $this->api->respond_error('Method Not Allowed', 405);
        }

        $this->api->require_jwt();

        $product = $this->ProductModel->find((int) $id);

        if (!$product) {
            $this->api->respond_error(
                'Product not found.',
                404
            );
        }

        $input = $this->api->body();

        if (
            empty($input['product_name']) ||
            !isset($input['price']) ||
            !isset($input['quantity'])
        ) {
            $this->api->respond_error(
                'Product name, price and quantity are required.',
                400
            );
        }

        $data = [
            'product_name' => $input['product_name'],
            'description'  => $input['description'] ?? '',
            'price'        => $input['price'],
            'quantity'     => $input['quantity']
        ];

        $updated = $this->ProductModel->update(
            (int) $id,
            $data
        );

        if ($updated === false) {
            $this->api->respond_error(
                'Failed to update product.',
                500
            );
        }

        $this->api->respond([
            'success' => true,
            'message' => 'Product updated successfully.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/products/{id}
    |--------------------------------------------------------------------------
    */

    public function delete($id)
    {
        $this->api->require_method('DELETE');

        $this->api->require_jwt();

        $product = $this->ProductModel->find((int) $id);

        if (!$product) {
            $this->api->respond_error(
                'Product not found.',
                404
            );
        }

        $deleted = $this->ProductModel->delete((int) $id);

        if (!$deleted) {
            $this->api->respond_error(
                'Failed to delete product.',
                500
            );
        }

        $this->api->respond([
            'success' => true,
            'message' => 'Product deleted successfully.'
        ]);
    }
}