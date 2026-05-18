import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RunHistory from './RunHistory';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    api: {
      get: jest.fn(() => new Promise(() => {})),
      post: jest.fn().mockResolvedValue({}),
    },
  }),
}));

describe('RunHistory smoke', () => {
  it('renders page shell without crashing', () => {
    render(
      <MemoryRouter>
        <RunHistory />
      </MemoryRouter>
    );

    expect(screen.getByText('Run History')).toBeTruthy();
  });
});
