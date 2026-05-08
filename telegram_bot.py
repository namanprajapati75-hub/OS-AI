import os
import httpx
from dotenv import load_dotenv
from pathlib import Path
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
from app.memory import save_message, get_memory

load_dotenv(Path(__file__).parent / ".env")

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
API_URL = "https://os-ai.onrender.com/run"


def safe_text(text):
    return str(text)


def split_message(text, chunk_size=3500):
    """Split a long string into chunks of maximum size."""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


def format_response(data: dict) -> str:
    """Format the API response into a readable Telegram message."""
    if data.get("status") == "error":
        return f"❌ Error: {data.get('message', 'Unknown error')}"

    lines = []
    lines.append(f"🚀 Goal: {data.get('goal', 'N/A')}")

    # Departments
    departments = data.get("departments", [])
    if departments:
        lines.append(f"\n🏢 Departments:")
        for dept in departments:
            lines.append(f"  • {dept}")

    # Tasks
    tasks = data.get("tasks", [])
    if tasks:
        lines.append(f"\n📋 Tasks:")
        for t in tasks:
            priority = t.get("priority", "").upper()
            lines.append(f"  • [{priority}] {t.get('department', '')}: {t.get('task', '')}")

    # Agent Results
    agent_results = data.get("agent_results", [])
    if agent_results:
        lines.append(f"\n🤖 Agent Results:")
        for ar in agent_results:
            agent_name = ar.get("agent", "unknown").upper()
            task = ar.get("task", "")
            output = ar.get("output", ar.get("error", ""))
            if len(output) > 1500:
                output = output[:1500] + "..."
            lines.append(f"\n[{agent_name}] {task}")
            lines.append(output)

    return safe_text("\n".join(lines))


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming text messages."""
    user_message = update.message.text
    user_id = str(update.message.chat_id)
    print(f"[Bot] Received: {user_message} (user: {user_id})")

    # Save user message to memory
    await save_message(user_id, "user", user_message)
    memory = await get_memory(user_id)
    print(f"[Memory] {memory}")

    await update.message.reply_text("⏳ Processing your goal...")

    payload = {"goal": user_message, "memory": memory}
    print(f"[Bot] Sending payload: {payload}")
    print(f"[Bot] Target URL: {API_URL}")

    try:
        print("[Bot] Waiting for backend response...")
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
            resp = await client.post(
                API_URL,
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            print(f"[Bot] API status: {resp.status_code}")
            print(f"[Bot] API response: {resp.text[:500]}")

            if resp.status_code != 200:
                await update.message.reply_text(f"❌ Backend error ({resp.status_code}): {resp.text[:200]}")
                return

            data = resp.json()

        reply = format_response(data)
        
        # Split message if it's too long
        for chunk in split_message(reply):
            await update.message.reply_text(chunk)

        # Save assistant response to memory
        await save_message(user_id, "assistant", reply)

    except httpx.ConnectError:
        await update.message.reply_text("❌ Backend is offline. Start uvicorn first.")
    except Exception as e:
        print(f"[Bot] Error: {type(e).__name__}: {e}")
        await update.message.reply_text(f"❌ Something went wrong: {e}")


def main():
    print(f"[Bot] Token loaded: {bool(TOKEN)}")
    print(f"[Bot] API target: {API_URL}")
    print("[Bot] Starting Telegram bot...")

    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.run_polling()


if __name__ == "__main__":
    main()
