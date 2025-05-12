import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../verify-jwt';
import axios from 'axios';

interface GenerateImageRequest {
  prompt: string;
  model: string;
  size: string;
}

export const POST = async (request: NextRequest) => {
  try {
    verifyToken(request);

    const { prompt, model, size }: GenerateImageRequest = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,
        size,
        model,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      status: 200,
      b64_json: response.data.data[0].b64_json,
    });
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      message?: string;
      response?: {
        status?: number;
        data?: {
          error?: {
            message?: string;
          };
        };
      };
    };

    console.error(
      'Error generating image:',
      err?.response?.data || err?.message
    );

    const status = err?.status || err?.response?.status || 500;
    const message =
      err?.response?.data?.error?.message || err?.message || 'Unknown error';

    return NextResponse.json({ status, message }, { status });
  }
};
