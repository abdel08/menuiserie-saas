// src/app/interventions/page.tsx

import Link from 'next/link';

export default function InterventionsList() {
  const fakeIds = ['abc123', 'def456'];

  return (
    <div>
      <h1>Liste des interventions</h1>
      <ul>
        {fakeIds.map((id) => (
          <li key={id}>
            <Link href={`/interventions/${id}`}>
              Intervention {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
