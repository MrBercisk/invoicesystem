<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    /**
     * Response sukses generik (index, show, update).
     * Body = data itu sendiri, tanpa wrapping. Sama seperti response()->json($data).
     */
    public static function success(mixed $data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status);
    }

    /**
     * Response untuk resource baru dibuat (store).
     * Default status 201, body = resource-nya langsung.
     */
    public static function created(mixed $data): JsonResponse
    {
        return response()->json($data, 201);
    }

    /**
     * Response pesan sederhana, misal untuk delete.
     * Body: { "message": "..." }
     */
    public static function message(string $message, int $status = 200): JsonResponse
    {
        return response()->json(['message' => $message], $status);
    }

    /**
     * Response error/conflict, misal foreign key constraint saat delete.
     * Body: { "message": "..." }
     */
    public static function error(string $message, int $status = 409): JsonResponse
    {
        return response()->json(['message' => $message], $status);
    }
}