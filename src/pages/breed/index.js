import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';

export async function getServerSideProps() {
  // Fetch all breeds from Firestore
  const querySnapshot = await getDocs(collection(db, 'breeds'));
  const breeds = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return {
    props: {
      breeds,
    },
  };
}

export default function BreedsPage({ breeds }) {
  return (
    <div>
      <h1>List of Dog Breeds</h1>
      <ul>
        {breeds.map((breed) => (
          <li key={breed.id}>
            <Link href={`/breed/${breed.id}`}>
              {breed.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
