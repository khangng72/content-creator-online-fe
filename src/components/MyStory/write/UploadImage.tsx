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

  const triggerUploadFile = () => {
    fileInputRef?.current?.click();
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
    console.log(uploadFile);

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
          className="w-[300px] h-[200px]"
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
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
              <button className="flex px-3 py-1 bg-rainbow active:scale-95 rounded-md relative text-white">
                <span>Generate With AI</span>
                <Sparkles
                  fill="yellow"
                  color="yellow"
                  className="absolute -top-2 -right-3"
                />
              </button>
            </div>

            <button className="bg-purpleRainbow text-white px-3 py-1 rounded-md flex items-center active:scale-95">
              <Save className="w-4 h-4 mr-1" onClick={handleSaveImage} />
              <span>Save</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadImage;
