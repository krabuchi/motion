import {useEffect, useState} from "react";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import './App.css';

export default function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);
    const fetchData = async () => {
        const {data} = await getCurrentUserProfile();
        setProfile(data);
    };
    
    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a
          className="App-link"
          href="http://localhost:8888/login"
        >
          Login to Spotify
        </a>
        ) : (
          <>
          <h1>Logged In</h1>
          <button onClick={logout}>Logout</button>
          {profile && (
            <>
              <h1>{profile.display_name}</h1>
              <p>{profile.followers.total}</p>
              {profile.images.length && profile.images[0].url && (
                <img src={profile.images[0].url} alt="avatar" />
              )}
            </>
          )}
          </>
        )}        
      </header>
    </div>
  );
}