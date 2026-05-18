import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    api: { get: jest.fn() },
    loading: true,
    user: null,
  }),
}));

jest.mock('../components/MapComponent', () => () => <div>Mock Map</div>);

describe('Home smoke', () => {
  beforeAll(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: jest.fn() },
      configurable: true,
    });
  });

  it('renders heading without crashing', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Runners Nearby')).toBeTruthy();
  });
});
