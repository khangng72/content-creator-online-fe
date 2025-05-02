import ExploreByGenre from '@/components/Explore/genre/ExploreByGenre';
import React from 'react';

const ExploreByGenrePage = async ({
  params,
}: {
  params: Promise<{ genre_id: string }>;
}) => {
  const { genre_id } = await params;

  return <ExploreByGenre genre_id={genre_id} />;
};

export default ExploreByGenrePage;
