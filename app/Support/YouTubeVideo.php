<?php

namespace App\Support;

use InvalidArgumentException;

final class YouTubeVideo
{
    public static function extractId(string $url): string
    {
        if (str_contains($url, '<')) {
            throw new InvalidArgumentException('Invalid YouTube URL.');
        }

        $parts = parse_url($url);
        if (($parts['scheme'] ?? '') !== 'https') {
            throw new InvalidArgumentException('Invalid YouTube URL.');
        }

        $host = strtolower($parts['host'] ?? '');
        $path = trim($parts['path'] ?? '', '/');
        parse_str($parts['query'] ?? '', $query);

        $id = match ($host) {
            'youtu.be', 'www.youtu.be' => explode('/', $path)[0] ?? null,
            'youtube.com', 'www.youtube.com', 'm.youtube.com' => str_starts_with($path, 'embed/')
                ? explode('/', $path)[1] ?? null
                : ($path === 'watch' ? ($query['v'] ?? null) : null),
            default => null,
        };

        if (! is_string($id) || ! preg_match('/^[A-Za-z0-9_-]{6,50}$/', $id)) {
            throw new InvalidArgumentException('Invalid YouTube URL.');
        }

        return $id;
    }
}
