import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { Button, Divider, Flex, Metric, Title } from '@tremor/react';
import { useState } from 'react';
import { useIsMobile } from '../utils/mobile';
import { Dataset } from '../utils/types';

const t: Dataset = {
  close: 'Close',
  news: 'News',
  showMore: 'Show More',
  showLess: 'Show Less',
};

export type VersionNote = {
  version: string;
  notes: string[];
};

export default function VersionNotes({ versionNotes, onClose }: { versionNotes: VersionNote[]; onClose: () => void }) {
  const isMobile = useIsMobile(450); // 'sm' for tailwindcss breakpoints
  const isTablet = useIsMobile(640); // 'md' for tailwindcss breakpoints

  const [showMore, setShowMore] = useState(false);

  return (
    <Flex flexDirection="col">
      <Metric>{t.news}</Metric>
      {versionNotes.map((versionNote, index) => (
        <div className={index === 0 || showMore ? 'visible' : 'hidden'} key={index}>
          <Divider>
            <Title>{versionNote.version}</Title>
          </Divider>
          <ul className={`w-full md:w-[650px] list-disc ${isMobile ? 'w-300px' : isTablet ? 'w-400px' : 'w-450px'}`}>
            {versionNote.notes.map((note, noteIndex) => (
              <li className="text-left" key={noteIndex}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Flex className="gap-6 mt-6" justifyContent="center" alignItems="center">
        <Button className="font-bold" style={{ borderRadius: 24 }} onClick={onClose}>
          {t.close}
        </Button>
        <Button
          icon={showMore ? ArrowUpIcon : ArrowDownIcon}
          iconPosition="right"
          variant="light"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? t.showLess : t.showMore}
        </Button>
      </Flex>
    </Flex>
  );
}
