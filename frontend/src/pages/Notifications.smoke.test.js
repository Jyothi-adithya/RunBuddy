import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Notifications from './Notifications';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    api: {
      get: jest.fn(() => new Promise(() => {})),
      put: jest.fn().mockResolvedValue({}),
    },
  }),
}));

describe('Notifications smoke', () => {
  it('renders page shell without crashing', () => {
    render(
      <MemoryRouter>
        <Notifications />
      </MemoryRouter>
    );

    expect(screen.getByText('Notifications')).toBeTruthy();
  });
});
