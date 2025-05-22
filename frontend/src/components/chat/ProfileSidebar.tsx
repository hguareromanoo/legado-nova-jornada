
import React from 'react';
import { ClientProfile } from '@/types/chat';
import { Progress } from '@/components/ui/progress';

interface ProfileSidebarProps {
  profile: ClientProfile;
  completionPercentage: number;
}

const ProfileSidebar = ({ profile, completionPercentage }: ProfileSidebarProps) => {
  // Helper function to format and display profile info sections
  const renderSection = (title: string, items: any[], renderItem: (item: any) => React.ReactNode, score: number) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">{title}</h3>
          <span className="text-sm">
            {Math.round(score * 100)}%
          </span>
        </div>
        
        <Progress 
          value={score * 100} 
          className="h-1 mb-3" 
          indicatorClassName={`${score > 0.7 ? 'bg-green-500' : score > 0.3 ? 'bg-amber-500' : 'bg-rose-500'}`}
        />
        
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="text-sm">
                {renderItem(item)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">Nenhuma informação fornecida ainda</p>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Perfil</h2>
          <span className="text-sm font-medium">
            {Math.round(completionPercentage * 100)}% Completo
          </span>
        </div>
        
        <Progress 
          value={completionPercentage * 100} 
          className="h-2 mt-2" 
          indicatorClassName="bg-w1-primary-accent"
        />
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg">Informações Pessoais</h3>
          <span className="text-sm">
            {Math.round(profile.completion_score.personal * 100)}%
          </span>
        </div>
        
        <Progress 
          value={profile.completion_score.personal * 100} 
          className="h-1 mb-3"
          indicatorClassName={`${profile.completion_score.personal > 0.7 ? 'bg-green-500' : profile.completion_score.personal > 0.3 ? 'bg-amber-500' : 'bg-rose-500'}`}
        />
        
        <div className="space-y-1 text-sm">
          <p><strong>Nome:</strong> {profile.personal_info.name || 'Não informado'}</p>
          <p><strong>Idade:</strong> {profile.personal_info.age || 'Não informada'}</p>
          <p><strong>Estado Civil:</strong> {profile.personal_info.marital_status || 'Não informado'}</p>
          <p><strong>Profissão:</strong> {profile.personal_info.profession || 'Não informada'}</p>
        </div>
      </div>

      {/* Family Members */}
      {renderSection(
        "Membros da Família",
        profile.family_members,
        (member) => (
          <p>
            <strong>{member.relation}:</strong> {member.name || 'Não informado'} 
            {member.age ? `, ${member.age} anos` : ''}
          </p>
        ),
        profile.completion_score.family
      )}

      {/* Assets */}
      {renderSection(
        "Patrimônio",
        profile.assets,
        (asset) => (
          <p>
            <strong>{asset.asset_type}:</strong> {asset.description}
            {asset.estimated_value ? ` - R$ ${asset.estimated_value.toLocaleString('pt-BR')}` : ''}
          </p>
        ),
        profile.completion_score.assets
      )}

      {/* Goals */}
      {renderSection(
        "Objetivos",
        profile.goals,
        (goal) => (
          <p>
            <strong>{goal.goal_type}:</strong> {goal.description}
          </p>
        ),
        profile.completion_score.goals
      )}

      {/* Document Recommendations - Only show if completion is over 80% */}
      {profile.completion_score.overall >= 0.8 && profile.document_recommendations.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-lg mb-2">Documentos Recomendados</h3>
          <ul className="space-y-2">
            {profile.document_recommendations.map((doc, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className={`mr-2 w-2 h-2 mt-1.5 rounded-full ${doc.is_mandatory ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  {doc.reason && <p className="text-gray-600 text-xs">{doc.reason}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
