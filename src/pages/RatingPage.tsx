import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';

import useRoom from '../hooks/useRoom';
import Layout from '../components/Layout';
import JoinRoom from '../components/JoinRoom';
import HasNotStarted from '../components/HasNotStarted';
import HasEnded from '../components/HasEnded';
import BeerRating from '../components/BeerRating';

const RatingPage: React.FC<RouteComponentProps<{ code: string }>> = ({
  match,
  location,
}) => {
  const { room, loading, beers, users, activeBeerIndex } = useRoom(
    match.params.code
  );
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedBeerIndex, setSelectedBeerIndex] = useState(0);
  const currentUser = room && room.users ? room.users[currentUserId] : null;
  const activeBeer = activeBeerIndex !== null ? beers[selectedBeerIndex] : null;

  useEffect(() => {
    const userId = qs
      .parse(location.search, { ignoreQueryPrefix: true })
      .user?.toString();

    if (userId) {
      setCurrentUserId(userId);
    }
  }, [location.search]);

  useEffect(() => {
    if (activeBeerIndex !== null) {
      setSelectedBeerIndex(activeBeerIndex);
    }
  }, [activeBeerIndex]);

  return (
    <Layout loading={loading} error={!room ? 'Room not found' : undefined}>
      {renderContent()}
    </Layout>
  );

  function renderContent() {
    if (!room) {
      return null;
    }

    if (!currentUser) {
      return (
        <JoinRoom
          roomTitle={room.title}
          roomCode={match.params.code}
          setCurrentUserId={setCurrentUserId}
        />
      );
    }

    if (!room.hasStarted) {
      return (
        <HasNotStarted
          roomTitle={room.title}
          beerCount={beers.length}
          currentUserId={currentUser.id}
          users={users}
        />
      );
    }

    if (!activeBeer) {
      return (
        <HasEnded
          roomTitle={room.title}
          userRatings={currentUser.ratings}
          roomBeers={room && room.beers ? room.beers : null}
        />
      );
    }

    return (
      <BeerRating
        roomCode={match.params.code}
        beerCount={beers.length}
        currentBeer={activeBeer}
        currentUser={currentUser}
        currentRating={
          currentUser.ratings &&
          currentUser.ratings[activeBeer.id] !== undefined
            ? currentUser.ratings[activeBeer.id]
            : null
        }
        activeBeerIndex={activeBeerIndex}
        selectedBeerIndex={selectedBeerIndex}
        setSelectedBeerIndex={setSelectedBeerIndex}
      />
    );
  }
};

export default RatingPage;
