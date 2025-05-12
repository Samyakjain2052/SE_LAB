import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GroupBuy, Product, User, GroupParticipant } from '../types';
import { calculateSplitAmount } from '../utils/productParser';
import { useAuth } from './AuthContext';

interface GroupBuyContextType {
  groupBuys: GroupBuy[];
  currentGroupBuy: GroupBuy | null;
  createGroupBuy: (product: Product, maxParticipants: number) => GroupBuy;
  joinGroupBuy: (groupId: string, user: User) => void;
  confirmPayment: (groupId: string, userId: string) => void;
  confirmPurchase: (groupId: string) => void;
  findGroupBuyById: (id: string) => GroupBuy | undefined;
  setCurrentGroupBuy: (groupBuy: GroupBuy | null) => void;
  loading: boolean;
}

const GroupBuyContext = createContext<GroupBuyContextType | undefined>(undefined);

export const GroupBuyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([]);
  const [currentGroupBuy, setCurrentGroupBuy] = useState<GroupBuy | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user: currentUser } = useAuth();

  // Load saved group buys from localStorage
  useEffect(() => {
    const savedGroupBuys = localStorage.getItem('groupBuys');
    if (savedGroupBuys) {
      setGroupBuys(JSON.parse(savedGroupBuys));
    }
  }, []);

  // Save group buys to localStorage when updated
  useEffect(() => {
    if (groupBuys.length > 0) {
      localStorage.setItem('groupBuys', JSON.stringify(groupBuys));
    }
  }, [groupBuys]);

  const createGroupBuy = (product: Product, maxParticipants: number): GroupBuy => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    const amountPerPerson = calculateSplitAmount(product.price, maxParticipants);
    const creatorUser = {
      id: currentUser.id,
      name: currentUser.user_metadata?.name || currentUser.email,
      email: currentUser.email,
      phone: currentUser.phone || currentUser.user_metadata?.phone || ''
    };
    const newGroupBuy: GroupBuy = {
      id: `group-${Date.now()}`,
      product,
      creator: creatorUser,
      participants: [{
        user: creatorUser,
        status: 'joined',
        joinedAt: new Date().toISOString()
      }],
      maxParticipants,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      totalAmount: product.price,
      amountPerPerson,
      inviteLink: `${window.location.origin}/join/${Date.now()}`
    };
    setGroupBuys(prevGroupBuys => [...prevGroupBuys, newGroupBuy]);
    setCurrentGroupBuy(newGroupBuy);
    return newGroupBuy;
  };

  const joinGroupBuy = (groupId: string, user: User) => {
    setGroupBuys(prevGroupBuys => 
      prevGroupBuys.map(groupBuy => {
        if (groupBuy.id === groupId) {
          // Check if user already exists in participants
          const existingParticipant = groupBuy.participants.find(p => p.user.id === user.id);
          if (existingParticipant) {
            return groupBuy;
          }
          
          // Add new participant
          const updatedParticipants: GroupParticipant[] = [
            ...groupBuy.participants,
            {
              user,
              status: 'joined',
              joinedAt: new Date().toISOString()
            }
          ];
          
          return {
            ...groupBuy,
            participants: updatedParticipants
          };
        }
        return groupBuy;
      })
    );
  };

  const confirmPayment = (groupId: string, userId: string) => {
    setGroupBuys(prevGroupBuys => 
      prevGroupBuys.map(groupBuy => {
        if (groupBuy.id === groupId) {
          const updatedParticipants = groupBuy.participants.map(participant => {
            if (participant.user.id === userId) {
              return {
                ...participant,
                status: 'paid',
                paidAt: new Date().toISOString()
              };
            }
            return participant;
          });
          
          // Check if all participants have paid
          const allPaid = updatedParticipants.every(p => p.status === 'paid' || p.status === 'confirmed');
          
          return {
            ...groupBuy,
            participants: updatedParticipants,
            status: allPaid ? 'collecting' : groupBuy.status
          };
        }
        return groupBuy;
      })
    );
  };

  const confirmPurchase = (groupId: string) => {
    setGroupBuys(prevGroupBuys => 
      prevGroupBuys.map(groupBuy => {
        if (groupBuy.id === groupId) {
          // Only allow if all participants have paid
          const allPaid = groupBuy.participants.every(p => p.status === 'paid' || p.status === 'confirmed');
          if (!allPaid) {
            // Do not update if not all have paid
            return groupBuy;
          }
          const updatedParticipants = groupBuy.participants.map(participant => ({
            ...participant,
            status: 'confirmed'
          }));
          return {
            ...groupBuy,
            participants: updatedParticipants,
            status: 'complete'
          };
        }
        return groupBuy;
      })
    );
  };

  const findGroupBuyById = (id: string) => {
    return groupBuys.find(groupBuy => groupBuy.id === id);
  };

  return (
    <GroupBuyContext.Provider value={{
      groupBuys,
      currentGroupBuy,
      createGroupBuy,
      joinGroupBuy,
      confirmPayment,
      confirmPurchase,
      findGroupBuyById,
      setCurrentGroupBuy,
      loading
    }}>
      {children}
    </GroupBuyContext.Provider>
  );
};

export const useGroupBuy = () => {
  const context = useContext(GroupBuyContext);
  if (context === undefined) {
    throw new Error('useGroupBuy must be used within a GroupBuyProvider');
  }
  return context;
};