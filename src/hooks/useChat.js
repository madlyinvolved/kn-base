/**
 * Chat hook for Anthropic API integration
 * Implementation in T-014
 */
export function useChat() {
  return {
    messages: [],
    isLoading: false,
    sendMessage: () => {},
  }
}
