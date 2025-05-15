import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAwardsStore from './hooks/useAwardsStore';
import { Button } from '../ui/Button/Button';
import { ArrowLeft, Edit, History, Download } from 'lucide-react';

const AwardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { awards, updateAward } = useAwardsStore();
  
  const award = awards.find(a => a.id === id);

  if (!award) {
    return <div className="p-4">Award not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/awards')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Awards
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/awards/${id}/history`)}
          >
            <History className="mr-2 h-4 w-4" /> View History
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/awards/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Award
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/awards/export?ids=${id}`)}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{award.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Award Code" value={award.code} />
          <DetailItem label="Status" value={award.status} />
          <DetailItem label="Union" value={award.unionName} />
          <DetailItem label="Employer" value={award.employer} />
          <DetailItem label="Commencement Date" value={new Date(award.commencementDate).toLocaleDateString()} />
          <DetailItem label="Registration Date" value={new Date(award.registrationDate).toLocaleDateString()} />
          <DetailItem label="Duration" value={award.duration} />
          <DetailItem label="Gazette Number" value={award.gazetteNumber} />
          <DetailItem label="Gazette Date" value={new Date(award.gazetteDate).toLocaleDateString()} />
        </div>
        
        {award.description && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-700">{award.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-sm text-gray-900">{value}</p>
  </div>
);

export default AwardDetails;