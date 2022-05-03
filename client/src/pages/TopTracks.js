import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { SectionWrapper, TimeRangeButtons, TrackList } from "../components";
import { getTopTracks } from "../spotify";

const TopTracks = () => {    
    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {
            const userTopTracks = await getTopTracks(`${activeRange}_term`);
            setTopTracks(userTopTracks['data']);
        };
        
        catchErrors(fetchData());
    }, [activeRange]);
    return (
        <main>
        {topTracks && (
            <SectionWrapper title="Top tracks" breadcrumb={true}>
                <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange}  />
                <TrackList tracks={topTracks.items.slice(0, 10)} />
            </SectionWrapper>
        )}
        </main>
    )
};
export default TopTracks;