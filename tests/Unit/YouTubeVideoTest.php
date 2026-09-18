<?php

namespace Tests\Unit;

use App\Support\YouTubeVideo;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class YouTubeVideoTest extends TestCase
{
    public static function urls(): array
    {
        return [['https://www.youtube.com/watch?v=abc123XYZ'], ['https://youtu.be/abc123XYZ'], ['https://www.youtube.com/embed/abc123XYZ']];
    }

    #[DataProvider('urls')]
    public function test_it_extracts_supported_urls(string $url): void
    {
        $this->assertSame('abc123XYZ', YouTubeVideo::extractId($url));
    }

    public function test_it_rejects_invalid_urls(): void
    {
        $this->expectException(InvalidArgumentException::class);
        YouTubeVideo::extractId('https://evil.example/watch?v=abc123XYZ');
    }
}
