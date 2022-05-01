import { useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import { catchErrors } from "./utils";
import styled from "styled-components/macro";
import { GlobalStyle } from "./styles";

const StyledLoginButton = styled.a`
  background-color: var(--green);
  color: var(--white);
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);
    const fetchData = async () => {
        const {data} = await getCurrentUserProfile();
        console.log(data);
        setProfile(data);
    };
    
    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <StyledLoginButton
          className="App-link"
          href="http://localhost:8888/login"
        >
          Login to Spotify
        </StyledLoginButton>
        ) : (
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/top-artists" element={<h1>Top Aritists</h1>} />
              <Route path="/top-tracks" element={<h1>Top Tracks</h1>} />
              <Route path="/playlists/:id" element={ <h1>Playlist</h1>} />
              <Route path="/playlists" element={<h1>Playlists</h1>} />
              <Route path="/" element={
                <>
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
                </>}
              />
            </Routes>
          </Router>
        )}        
      </header>
    </div>
  );
}