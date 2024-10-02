import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export async function getServerSideProps(context) {
  const { breed } = context.params; // Get the breed slug from the URL
  const docRef = doc(db, 'breeds', breed); // Reference the specific breed document
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      notFound: true, // If the breed is not found, return a 404 page
    };
  }

  const data = {
    id: docSnap.id,
    ...docSnap.data(),
  };

  // Parse the description field (assuming it's stored as JSON string)
  const parsedDescription = JSON.parse(data.description || '{}');

  return {
    props: {
      breed: data.id,
      description: parsedDescription.description || 'No description available',
    },
  };
}

export default function BreedPage({ breed, description }) {
  return (
    <div>
      <h1>{breed}</h1>
      <p>{description}</p>
    </div>
  );
}
