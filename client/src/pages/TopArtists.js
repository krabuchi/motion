import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { getTopArtists } from "../spotify";
import { SectionWrapper, ArtistsGrid, TimeRangeButtons } from "../components";

const TopArtists = function () {
    const [topArtists, setTopArtists] = useState(null);
    const [activeRange, setActiveRange] = useState('short');


    useEffect(() => {
        const fetchData = async () => {
            const userTopArtits = await getTopArtists(`${activeRange}_term`);
            setTopArtists(userTopArtits['data']);
        };
        
        catchErrors(fetchData());
    }, [activeRange]);


    return (
        <main>
            {topArtists && (
                <SectionWrapper title="Top artists" breadcrumb={true}>
                    <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange} />
                    <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
                </SectionWrapper>
            )}
        </main>
    );
};

export default TopArtists;