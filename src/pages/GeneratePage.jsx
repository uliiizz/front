import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './GeneratePage.css'; // ⬅️ Add your custom styles here

export default function GeneratePage() {
  const { logout, user} = useContext(AuthContext);
  const [t, setT] = useState('298');
  const [k_0, setk0] = useState('0.001');
  const [z, setZ] = useState('1');
  const [epsilon_sl, setEpsilon] = useState('78.5');
  const [frequencies, setFrequencies] = useState(['1', '6', '1000']);
  const [concentrations, setConcentrations] = useState(['2', '5', '50']);
  const [mobilities, setMobilities] = useState(['0.0001', '0.1', '50']);
  const [title, setTitle] = useState('')
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesFetched, setFilesFetched] = useState(false);

  

  const handleArrayChange = (setter, arr, index, value) => {
    const newArr = [...arr];
    newArr[index] = value;
    setter(newArr);
  };

  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const res = await api.get(`/eis/history`);
      setFiles(res.data);
    } catch (err) {
      toast.error('Не вдалось завантажити файли');
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    if (!filesFetched) {
      fetchFiles();
      setFilesFetched(true);
    }
  }, [filesFetched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');
    setLoading(true);
    try {
      const payload = {
        T: Number(t),
        k_0: Number(k_0),
        z: Number(z),
        epsilon_sl: Number(epsilon_sl),
        frequencies: frequencies.map(Number),
        concentrations: concentrations.map(Number),
        mobilities: mobilities.map(Number),
        title,
      };
      const res = await api.post('/eis/generate', payload);
      setResult(res.data.downloadUrl);
      toast.success('CSV успішно згенерувались!');
      fetchFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Помилка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <header className="generate-header">
        <h2>📊 Генератор простору ознак електрохімічно-імпедансних спектрів</h2>
        {user && <div className="user-name">👤 {user.email}</div>}
        <button className="logout-button" onClick={logout}>Вийти</button>
      </header>
      

      <form className="generate-form" onSubmit={handleSubmit}>
        <div className='section'>
            <label>Назва файлу</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="section">
          {[{ label: 'Температура в Кельвінах', value: t, setter: setT },
            { label: 'Стала швидкості реакції', value: k_0, setter: setk0 },
            { label: 'Заряд іонів', value: z, setter: setZ },
            { label: 'Відносна діелектрична проникність розчину', value: epsilon_sl, setter: setEpsilon }].map((field) => (
              <div key={field.label} className="form-group">
                <label>{field.label}</label>
                <input type="number" value={field.value} onChange={(e) => field.setter(e.target.value)} required />
              </div>
          ))}
        </div>

        {[
          { label: 'Діапазон частот Гц (у логарифмічному (від, до, кількість значень))', arr: frequencies, setter: setFrequencies },
          { label: 'Концентрації ppm (у логарифмічному (від, до, кількість значень))', arr: concentrations, setter: setConcentrations },
          { label: 'Рухливості м2/В·с (у лінійному(від, до, кількість значень))', arr: mobilities, setter: setMobilities },
        ].map(({ label, arr, setter }) => (
          <div key={label} className="section">
            <label>{label}</label>
            <div className="input-array">
              {arr.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => handleArrayChange(setter, arr, i, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="generate-button" disabled={loading}>
          {loading ? 'Генеруємо...' : 'Згенерувати CSV'}
        </button>
        <button
          type="button"
          className="generate-button"
          style={{ marginLeft: '10px' }}
          onClick={() => {
            const text = `# Встановлення бібліотеки
        !pip install boto3

        import boto3
        import pandas as pd
        from io import StringIO

        # Дані доступу 
        aws_access_key_id = '${import.meta.env.aws_access_key_id }'
        aws_secret_access_key = '${import.meta.env.aws_secret_access_key }'
        bucket_name = 'eisgenerator'
        s3_file_key = 'ВВЕДІТЬ СЮДИ ШЛЯХ ДО ПОТРІБНОГО ФАЙЛУ'  # Наприклад: 'data/myfile.csv'

        s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )

        # Завантаження файлу в память
        response = s3_client.get_object(Bucket=bucket_name, Key=s3_file_key)
        csv_content = response['Body'].read().decode('utf-8')

        # Завантаження як pandas DataFrame
        df = pd.read_csv(StringIO(csv_content))

        # Вивід перших рядків
        df.head()`;

            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'aws_s3_load_example.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          📄 Скрипт для Google Colab
        </button>

      </form>

      {result && (
        <a href={result} download className="download-link" target="_blank" rel="noopener noreferrer">
          ⬇️ Download CSV
        </a>
      )}

      <hr />

      <section className="file-list-section">
        <h3>📁 Ваші CSV файли</h3>
        {filesLoading ? (
          <p>Завантажуємо файли...</p>
        ) : files.length === 0 ? (
          <p>Файли не знайдено</p>
        ) : (
          <ul className="file-list">
            {files.map((file, i) => (
              <li key={i}>
                <a href={file.signedUrl} target="_blank" rel="noopener noreferrer" download>
                  📄 {file.name} ({file.size}) — {new Date(file.createdAt).toLocaleString()}
                </a>
                {file.s3Key && (
                  <div className="s3key-display">🔑 S3 шлях: <code>{file.s3Key}</code></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
