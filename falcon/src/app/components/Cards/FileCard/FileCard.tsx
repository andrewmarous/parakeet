import { ImgFileIcon, PdfFileIcon } from '@/assets';
import { FiTrash } from 'react-icons/fi';

import { Button } from '../../Inputs/Button/Button';
import { Card } from '../Base';

interface FileCardProps {
  name: string;
  size: number;
  type: string;
  onClick?: () => void;
  onRemove?: () => void;
}

export default function FileCard({
  name,
  size,
  type,
  onClick,
  onRemove,
}: FileCardProps) {
  const formattedSize = () => {
    const bytes = size;
    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;

    if (megabytes >= 1) {
      return `${megabytes.toFixed(2)} MB`;
    } else {
      return `${kilobytes.toFixed(2)} KB`;
    }
  };

  return (
    <Card
      className={'flex flex-row justify-between p-4'}
      onClick={onClick}
      clickable={!!onClick}
    >
      <div className="flex flex-row items-center gap-4">
        {type !== 'application/pdf' ? (
          <ImgFileIcon className="h-8 w-8" />
        ) : (
          <PdfFileIcon className="h-8 w-8" />
        )}
        <div className="flex flex-col">
          <p className="text-sm">{name}</p>
          <p className="text-sm text-medium-grey">{formattedSize()}</p>
        </div>
      </div>
      <div className="">
        {onRemove && (
          <Button variant="tertiary" size={'icon'} onClick={() => onRemove()}>
            <FiTrash />
          </Button>
        )}
      </div>
    </Card>
  );
}
