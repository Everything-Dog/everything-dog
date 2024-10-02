import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

export default function AddBreedPage() {
  const [jsonData, setJsonData] = useState('{}');
  const [message, setMessage] = useState('');

  const handleEditorChange = (value) => {
    setJsonData(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const breedData = JSON.parse(jsonData);
      if (!breedData.breed_name) {
        setMessage('Error: "breed_name" is required in the JSON data.');
        return;
      }
      const { breed_name, ...restData } = breedData;

      const breedDocRef = doc(db, 'breeds', breed_name);

      await setDoc(breedDocRef, restData);
      setMessage('Breed data added successfully!');
    } catch (error) {
      console.error('Error adding breed: ', error);
      setMessage('Error adding breed. Please check your JSON data.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
          Add a New Breed
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="breedJson"
              className="block text-xl font-semibold text-gray-800 mb-2"
            >
              Breed JSON:
            </label>
            <div className="h-[500px] rounded-lg border border-gray-300 shadow-inner overflow-hidden" style={{"width": "1500px", "height": "750px"}}>
              <AceEditor
                mode="json"
                theme="monokai"
                value={jsonData}
                onChange={handleEditorChange}
                name="breedJsonEditor"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                height="100%"
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-3 px-8 rounded-full text-lg font-medium shadow-lg hover:bg-indigo-700 transition duration-300"
            >
              Add Breed
            </button>
          </div>
        </form>
        {message && (
          <p
            className={`mt-6 text-center text-lg font-medium ${
              message.includes('Error') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
