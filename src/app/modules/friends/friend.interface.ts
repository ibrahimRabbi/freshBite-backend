import { ObjectId } from 'mongodb';

export interface IFriend {
  senderId: ObjectId;              
  userId: ObjectId;          
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';           
  tierLabel: 'tier1' | 'tier2' | 'tier3' | null;    
  blockedBy: ObjectId | null;     
  requestedAt: Date;
  blockedAt?: Date | null;
  labeledAt?: Date | null;
}

 
 