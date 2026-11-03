import asyncio
import sys

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from backend.app.services.dify_service import dify_service

async def main():
    print("=" * 60)
    print("[*] AEROTWIN - DIFY AI RAG WORKFLOW TEST")
    print("=" * 60)

    
    question = "Recommend pre-flight maintenance checklist for Rotax 914 F"
    predicted_rul = "180"
    
    print(f"\n[1] Sending Query to Dify Workflow:")
    print(f"    - User Question: {question}")
    print(f"    - Predicted RUL: {predicted_rul} cycles\n")
    print("... Waiting for Dify RAG response...")
    
    result = await dify_service.query_maintenance_advisory(
        user_question=question,
        predicted_rul=predicted_rul
    )
    
    if result.get("status") == "success":
        print("\n[SUCCESS] Dify RAG responded successfully:")
        print("-" * 60)
        print(result.get("answer"))
        print("-" * 60)
        print(f"Elapsed Time: {result.get('elapsed_time')} seconds")
        print(f"Total Tokens: {result.get('total_tokens')}")
        print(f"Run ID:       {result.get('workflow_run_id')}")
        print("=" * 60)
    else:
        print("\n[FAILED] Failed to get response:")
        print(result.get("error"))
        print(result.get("answer"))
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
