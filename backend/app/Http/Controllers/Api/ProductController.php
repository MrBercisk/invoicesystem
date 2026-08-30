<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(Product::latest()->get());
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        return ApiResponse::created($product);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        return ApiResponse::success($product);
    }

    public function destroy(Product $product): JsonResponse
    {
        try {
            $product->delete();

            return ApiResponse::message('Deleted');
        } catch (QueryException $e) {
            return ApiResponse::error('Produk tidak bisa dihapus karena masih digunakan di invoice.');
        }
    }
}