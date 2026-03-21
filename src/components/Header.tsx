@@ .. @@
 import React, { useState } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import { Menu, X, User, LogOut, Settings } from 'lucide-react';
 import { useAuth } from '../hooks/useAuth';
+import { SubscriptionStatus } from './SubscriptionStatus';
 
 export function Header() {
 }
@@ .. @@
               <div className="flex items-center space-x-4">
+                <SubscriptionStatus />
                 <div className="relative">
                   <button
                     onClick={() => setShowUserMenu(!showUserMenu)}