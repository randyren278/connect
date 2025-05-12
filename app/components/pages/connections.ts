import type { NextApiRequest, NextApiResponse } from 'next';
import { buildGroup } from '../lib/groupFactory';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [easy, medium, hard, extreme] = await Promise.all([
      buildGroup('easy'),
      buildGroup('medium'),
      buildGroup('hard'),
      buildGroup('extreme'),
    ]);

    res.status(200).json({ groups: [easy, medium, hard, extreme] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create puzzle' });
  }
}
