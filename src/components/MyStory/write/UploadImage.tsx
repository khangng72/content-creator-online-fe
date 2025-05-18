import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import StoriImage from '@/components/ui/StoriImage';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ImageIcon, ImageUp, Save, Sparkles } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, UPDATE_IMAGE } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import { b64JsonToFile } from '@/utils/b64JsonToFile';

interface UploadImageProps {
  chapterId: string;
  chapterTitle: string;
  chapterImageUri: string | null;
  fetchChapter: () => Promise<void>;
}

const UploadImage = ({
  chapterId,
  chapterTitle,
  chapterImageUri,
  fetchChapter,
}: UploadImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState<string>('');

  const triggerUploadFile = () => {
    fileInputRef?.current?.click();
  };

  const toggleDialog = () => {
    setOpen((prev) => !prev);
    setPreviewImage(chapterImageUri);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      setUploadFile(file);

      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
    }
  };

  const handleSaveImage = async () => {
    const token = Cookies.get('token');

    if (!uploadFile) {
      return;
    }

    const formFile = new FormData();
    formFile.append('file', uploadFile as File);
    const uploadFileResult = await axios
      .post('/api/upload', formFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log('Error', error);
      });

    await axios
      .put(
        generateApi(UPDATE_IMAGE, chapterId),
        {
          chapterImageUri: uploadFileResult?.data.path || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          duration: 2000,
          variant: 'destructive',
        });
        console.log('Error', error);
      })
      .then(async () => {
        toast({
          title: 'Image uploaded successfully',
          description: 'Your image has been uploaded successfully.',
          duration: 2000,
        });
        await fetchChapter();
      })
      .finally(() => {
        setOpen(false);
        setUploadFile(null);
      });
  };

  const handleGenerateWithAI = async () => {
    if (!prompt) {
      toast({
        title: 'Error',
        description: 'Please provide a description for AI generation.',
        duration: 2000,
        variant: 'destructive',
      });
      return;
    }

    const token = Cookies.get('token');

    setIsGenerating(true);

    try {
      const introPrompt = `Generate a image with this description. `;

      const response = await axios.post('/api/ai/generate-image', {
        prompt: introPrompt + prompt,
        model: 'gpt-image-1',
        size: '1536x1024',
      });

      const base64Img = response.data.b64_json;
      const file = b64JsonToFile(
        base64Img,
        `${chapterTitle.replace(/\s+/g, '_')}_img.png`
      );

      setPreviewImage(URL.createObjectURL(file));

      const formFile = new FormData();
      formFile.append('file', file as File);

      const uploadFileResult = await axios
        .post('/api/upload', formFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          console.log('Error', error);
        });

      await axios.put(
        generateApi(UPDATE_IMAGE, chapterId),
        {
          chapterImageUri: uploadFileResult?.data.path || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchChapter();
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate image',
        duration: 2000,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      toast({
        title: 'Image generated successfully',
        description: 'Your image has been generated successfully.',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (chapterImageUri) {
      setPreviewImage(chapterImageUri);
    }
  }, [chapterImageUri]);

  return (
    <div className="w-full py-3 flex justify-center items-center border-b border-accent flex-col gap-2">
      {chapterImageUri && (
        <StoriImage
          source={chapterImageUri}
          storyTitle={chapterTitle}
          className="w-[300px] h-[200px] md:w-[450px] md:h-[300px]"
        />
      )}
      <Dialog open={open} onOpenChange={toggleDialog}>
        <DialogTrigger>
          <div>
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-xl font-bold">
              Upload Image
            </DialogTitle>
            <DialogDescription className="hidden">
              Upload Image
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 items-center">
            <StoriImage
              source={previewImage}
              storyTitle={chapterTitle}
              className="w-[300px] h-[200px]"
            />

            {isGenerating ? (
              <div>Generating... please wait until image generation finish</div>
            ) : (
              <textarea
                className="w-[100%] rounded-md px-3 py-2 text-sm resize-none border border-accent focus:outline-none"
                placeholder="Please describe the image for AI generation"
                rows={4}
                onChange={(e) => setPrompt(e.target.value)}
              />
            )}
            <div className="flex gap-1 justify-center text-sm sm:text-base mt-2">
              <button
                className="bg-foreground text-background px-3 py-1 rounded-md flex gap-1 items-center"
                onClick={triggerUploadFile}
              >
                <ImageUp className="w-4 h-4" />
                <span>Upload</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              <button
                className="flex px-3 py-1 bg-rainbow active:scale-95 rounded-md relative text-white"
                onClick={handleGenerateWithAI}
              >
                <span>Generate With AI</span>
                <Sparkles
                  fill="yellow"
                  color="yellow"
                  className="absolute -top-2 -right-3"
                />
              </button>
            </div>

            <button
              className="bg-purpleRainbow text-white px-3 py-1 rounded-md flex items-center active:scale-95"
              onClick={handleSaveImage}
            >
              <Save className="w-4 h-4 mr-1" />
              <span>Save</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadImage;
