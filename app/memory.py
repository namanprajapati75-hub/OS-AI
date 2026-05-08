memory_store = {}


def save_message(user_id: str, role: str, content: str):
    if user_id not in memory_store:
        memory_store[user_id] = []
    memory_store[user_id].append({"role": role, "content": content})


def get_memory(user_id: str) -> list:
    return memory_store.get(user_id, [])


def clear_memory(user_id: str):
    memory_store.pop(user_id, None)
