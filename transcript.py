import asyncio
import openai
from openai import OpenAI
import os
from dotenv import load_dotenv
import ast
import pyaudio
import whisper
import numpy as np
from pydub import AudioSegment
from pydub.playback import play

load_dotenv()

client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))
model = whisper.load_model("base")

async def record_audio(filename, duration=10, rate=44100, channels=2):
    p = pyaudio.PyAudio()

    stream = p.open(format=pyaudio.paInt16,
                    channels=channels,
                    rate=rate,
                    input=True,
                    frames_per_buffer=1024)

    print("Recording...")

    frames = []
    for _ in range(int(rate /   1024 * duration)):
        data = stream.read(1024)
        frames.append(data)

    print("Finished recording")

    stream.stop_stream()
    stream.close()
    p.terminate()

    audio_segment = AudioSegment(
        b''.join(frames),
        frame_rate=rate,
        sample_width=p.get_sample_size(pyaudio.paInt16),
        channels=channels
    )

    audio_segment.export(filename, format="mp3")

    return filename

async def transcribe_audio(filename):
    result = model.transcribe(filename)
    print(result)

def get_keywords(input):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You will be provided with a call recording transcript of customer & call center employee and your task is to extract a list of keywords"""
                },
                {
                    "role": "user",
                    "content": input
                }
            ],
            temperature=0.9,
            max_tokens=64,
            top_p=1
        )

        return response.dict()['choices'][0]['message']['content']

    except Exception as e:
        print(e)
        return None

import asyncio
import openai
from openai import OpenAI
import os
from dotenv import load_dotenv
import ast
import pyaudio
import whisper
import numpy as np
from pydub import AudioSegment
from pydub.playback import play

load_dotenv()

client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))
model = whisper.load_model("base")

async def record_audio(filename, duration=10, rate=44100, channels=2):
    p = pyaudio.PyAudio()

    stream = p.open(format=pyaudio.paInt16,
                    channels=channels,
                    rate=rate,
                    input=True,
                    frames_per_buffer=1024)

    print("Recording...")

    frames = []
    for _ in range(int(rate /   1024 * duration)):
        data = stream.read(1024)
        frames.append(data)

    print("Finished recording")

    stream.stop_stream()
    stream.close()
    p.terminate()

    audio_segment = AudioSegment(
        b''.join(frames),
        frame_rate=rate,
        sample_width=p.get_sample_size(pyaudio.paInt16),
        channels=channels
    )

    audio_segment.export(filename, format="mp3")

    return filename

async def transcribe_audio(filename):
    result = model.transcribe(filename)
    print(result)

async def main():
    while True:
        filename = await record_audio("temp.mp3")
        await transcribe_audio(filename)
    
        # keywords = get_keywords(result["text"])
        # print(keywords)

asyncio.run(main())