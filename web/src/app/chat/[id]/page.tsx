"use client";

import { mistral } from "@ai-sdk/mistral";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { generateText } from "ai";
import { notFound, useParams } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer";
import { useSupabase } from "~/lib/supabase/client";
import { dataOrThrow } from "~/lib/utils";

interface ChatMessage {
    sender: "user" | "ai";
    message: string;
}

export default function ChatBot() {
    const supabase = useSupabase();
    const { id } = useParams();
    if (typeof id !== "string") notFound();
    const { data: pokemon } = useSuspenseQuery({
        queryKey: ["observation", id],
        async queryFn() {
            return dataOrThrow(
                await supabase.from("Observations").select("*, Species(*), users(*)").eq("id", +id).limit(1),
            ).at(0);
        },
    });

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    const fetchAIResponse = async (userMessage: string) => {
        try {
            // Add the user's message to the chat history
            const newChatHistory: ChatMessage[] = [...chatHistory, { sender: "user", message: userMessage }];
            setChatHistory(newChatHistory);

            // Fetch AI's response
            const { text } = await generateText({
                model: mistral("mistral-large-latest"),
                prompt: userMessage,
            });

            // Add the AI's response to the chat history
            const updatedChatHistory: ChatMessage[] = [...newChatHistory, { sender: "ai", message: text }];
            setChatHistory(updatedChatHistory);
        } catch (error) {
            console.error("Error generating text:", error);
        }
    };

    // Handle user input and fetch response
    const handleUserInput = (event: FormEvent): void => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const userMessage = (form.elements.namedItem("message") as HTMLInputElement).value;
        if (userMessage.trim()) {
            fetchAIResponse(userMessage);
            form.reset(); // Clear input field
        }
    };

    if (!pokemon) notFound();
    return (
        <div>
            <h1>AI Chat</h1>

            {/* Display the chat history */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {chatHistory.map((chat) => (
                    <div key={chat.message} style={{ margin: "10px 0" }}>
                        <strong>{chat.sender === "user" ? "You" : "AI"}:</strong>
                        <p>{chat.message}</p>
                    </div>
                ))}
            </div>

            {/* User input form */}
            <form onSubmit={handleUserInput}>
                <input
                    type="text"
                    name="message"
                    placeholder="Type your message..."
                    style={{ width: "300px", padding: "10px" }}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
