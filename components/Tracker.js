'use client';
import { useEffect } from 'react';
import { track } from './Works';

export default function Tracker() {
  useEffect(() => { track({ type: 'view', label: 'home' }); }, []);
  return null;
}
