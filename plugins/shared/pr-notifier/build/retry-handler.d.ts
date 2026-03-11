/**
 * Smart retry handler with exponential backoff
 */
export interface RetryOptions {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
export declare class RetryHandler {
    private options;
    private consecutiveFailures;
    constructor(options?: RetryOptions);
    /**
     * Execute function with retry logic
     */
    execute<T>(fn: () => Promise<T>, context: string): Promise<T>;
    /**
     * Calculate delay with exponential backoff
     */
    private calculateDelay;
    /**
     * Get current health status
     */
    getHealthStatus(): "healthy" | "degraded" | "unhealthy";
    /**
     * Get failure count
     */
    getFailureCount(): number;
    /**
     * Reset failure counter
     */
    reset(): void;
    private sleep;
}
