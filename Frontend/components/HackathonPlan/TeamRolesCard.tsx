'use client';

import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  responsibilities: string[];
}

interface TeamRolesCardProps {
  teamMembers: TeamMember[];
}

export default function TeamRolesCard({ teamMembers }: TeamRolesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-xl">
          <Users className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Team Role Assignments</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {member.role}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Responsibilities</p>
              <ul className="space-y-1.5">
                {member.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1 h-1 bg-purple-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
