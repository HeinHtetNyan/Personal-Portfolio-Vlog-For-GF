#!/usr/bin/env python3
"""
One-time setup script for July Portfolio backend.
Run this once before starting the server for the first time.

Usage:
    python setup.py
"""
import os
import secrets
import getpass
import re
from pathlib import Path

ENV_PATH = Path(__file__).parent / ".env"
EXAMPLE_PATH = Path(__file__).parent / ".env.example"


def read_env(path: Path) -> dict:
    env = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip()
    return env


def write_env(path: Path, env: dict) -> None:
    lines = []
    for k, v in env.items():
        lines.append(f"{k}={v}")
    path.write_text("\n".join(lines) + "\n")


def already_configured(env: dict) -> bool:
    """Returns True if .env has been properly configured (not just placeholder values)."""
    placeholder_key = "change-this-to-a-random-secret-key-at-least-32-chars"
    placeholder_email = "admin@example.com"
    return (
        env.get("SECRET_KEY", "") != placeholder_key
        and env.get("FIRST_ADMIN_EMAIL", "") != placeholder_email
    )


def validate_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def main():
    print("\n" + "=" * 52)
    print("  July Portfolio — First-time Setup")
    print("=" * 52 + "\n")

    # Load existing .env if present, otherwise start from .env.example
    if ENV_PATH.exists():
        env = read_env(ENV_PATH)
        if already_configured(env):
            print("✓ Setup already completed.")
            print(f"  Admin email : {env.get('FIRST_ADMIN_EMAIL')}")
            print(f"  SECRET_KEY  : {env.get('SECRET_KEY', '')[:8]}…\n")
            redo = input("Run setup again and overwrite existing credentials? [y/N] ").strip().lower()
            if redo != "y":
                print("\nNo changes made. Run the server with:  docker compose up -d\n")
                return
    else:
        env = read_env(EXAMPLE_PATH) if EXAMPLE_PATH.exists() else {}

    print("Enter your admin credentials.\n")

    # Email
    while True:
        email = input("Admin email: ").strip()
        if validate_email(email):
            break
        print("  ✗ Invalid email address. Please try again.")

    # Password
    while True:
        password = getpass.getpass("Admin password (min 8 chars): ")
        if len(password) < 8:
            print("  ✗ Password must be at least 8 characters.")
            continue
        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("  ✗ Passwords do not match. Please try again.")
            continue
        break

    # Generate a secure random SECRET_KEY
    secret_key = secrets.token_hex(32)

    # Update env values
    env["SECRET_KEY"] = secret_key
    env["FIRST_ADMIN_EMAIL"] = email
    env["FIRST_ADMIN_PASSWORD"] = password

    write_env(ENV_PATH, env)

    print("\n" + "=" * 52)
    print("  Setup complete!")
    print("=" * 52)
    print(f"\n  Admin email : {email}")
    print(f"  SECRET_KEY  : {secret_key[:8]}… (saved to .env)")
    print("\n  ⚠  IMPORTANT: Never commit .env to version control.")
    print("\n  Next steps:")
    print("    1. docker compose up -d     ← start everything")
    print(f"    2. Login at http://localhost:5174 with {email}")
    print()

    # If DB is already running, offer to update the password in-place
    try:
        import sys
        sys.path.insert(0, str(Path(__file__).parent))
        from dotenv import load_dotenv
        load_dotenv(ENV_PATH, override=True)
        from app.db.session import SessionLocal
        from app.models.user import User
        from app.core.security import hash_password

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.password_hash = hash_password(password)
                db.commit()
                print("  ✓ Password updated in running database.")
            else:
                print("  ℹ  Admin will be created on next server start.")
        finally:
            db.close()
    except Exception:
        print("  ℹ  Admin will be created on next server start.")


if __name__ == "__main__":
    main()
