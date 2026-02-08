<?php

return [
    // Navigation
    'nav' => [
        'dashboard' => 'Tableau de bord',
        'courses' => 'Formations',
        'cohorts' => 'Cohortes',
        'users' => 'Utilisateurs',
        'settings' => 'Paramètres',
        'sessions' => 'Sessions',
        'my_attendance' => 'Ma présence',
        'profile' => 'Profil',
        'logout' => 'Déconnexion',
        'audit_log' => 'Journal',
        'help' => 'Aide',
    ],

    // Common
    'common' => [
        'save' => 'Enregistrer',
        'cancel' => 'Annuler',
        'delete' => 'Supprimer',
        'edit' => 'Modifier',
        'create' => 'Créer',
        'search' => 'Rechercher...',
        'actions' => 'Actions',
        'back' => 'Retour',
        'view' => 'Voir',
        'yes' => 'Oui',
        'no' => 'Non',
        'confirm' => 'Confirmer',
        'loading' => 'Chargement...',
        'saving' => 'Enregistrement...',
        'saved' => 'Enregistré !',
        'export_csv' => 'Exporter CSV',
        'no_data' => 'Aucune donnée disponible',
        'refresh' => 'Actualiser',
        'refreshed' => 'Actualisé',
        'active' => 'Actif',
        'inactive' => 'Inactif',
        'none' => 'Aucun',
        'never' => 'Jamais',
        'set' => 'Défini',
        'not_set' => 'Non défini',
        'open' => 'Ouvert',
        'filter' => 'Filtrer',
        'all' => 'Tous',
    ],

    // Auth
    'auth' => [
        'login' => 'Connexion',
        'register' => 'Inscription',
        'email' => 'Email',
        'password' => 'Mot de passe',
        'remember_me' => 'Se souvenir de moi',
        'forgot_password' => 'Mot de passe oublié ?',
        'reset_password' => 'Réinitialiser le mot de passe',
        'confirm_password' => 'Confirmer le mot de passe',
        'name' => 'Nom',
        'phone' => 'Téléphone',
    ],

    // Dashboard
    'dashboard' => [
        'title' => 'Tableau de bord',
        'welcome' => 'Bienvenue',
        'total_users' => 'Utilisateurs',
        'active_cohorts' => 'Cohortes actives',
        'today_sessions' => 'Sessions du jour',
        'check_ins_today' => 'Pointages aujourd\'hui',
        'attendance_rate' => 'Taux de présence',
    ],

    // Courses
    'courses' => [
        'title' => 'Formations',
        'create' => 'Créer une formation',
        'edit' => 'Modifier la formation',
        'name' => 'Nom de la formation',
        'code' => 'Code',
        'description' => 'Description',
        'organization' => 'Organisation',
        'active_cohorts' => 'Cohortes actives',
        'total_students' => 'Total stagiaires',
        'default_times' => 'Horaires par défaut',
        'am_session' => 'Session matin',
        'pm_session' => 'Session après-midi',
        'grace_period' => 'Période de grâce (minutes)',
    ],

    // Cohorts
    'cohorts' => [
        'title' => 'Cohortes',
        'create' => 'Créer une cohorte',
        'edit' => 'Modifier la cohorte',
        'name' => 'Nom de la cohorte',
        'course' => 'Formation',
        'start_date' => 'Date de début',
        'end_date' => 'Date de fin',
        'is_active' => 'Active',
        'enrolled_students' => 'Stagiaires inscrits',
        'weekly_schedule' => 'Emploi du temps',
        'sessions' => 'Sessions',
        'grace_period' => 'Période de grâce',
        'regenerate_sessions' => 'Régénérer les sessions',
        'details' => 'Détails de la cohorte',
    ],

    // Users
    'users' => [
        'title' => 'Utilisateurs',
        'create' => 'Créer un utilisateur',
        'edit' => 'Modifier l\'utilisateur',
        'name' => 'Nom',
        'email' => 'Email',
        'phone' => 'Téléphone',
        'role' => 'Rôle',
        'roles' => 'Rôles',
        'organization' => 'Organisation',
        'pin' => 'Code PIN',
        'reset_pin' => 'Réinitialiser le PIN',
        'change_password' => 'Changer le mot de passe',
        'details' => 'Détails utilisateur',
        'member_since' => 'Membre depuis',
        'last_login' => 'Dernière connexion',
        'pin_status' => 'État du PIN',
        'edit_profile' => 'Modifier le profil',
        'pin_reset_success' => 'PIN réinitialisé avec succès',
        'reset_pin_confirm' => 'Générer un nouveau PIN à 4 chiffres pour :name ?',
        'delete_confirm' => 'Êtes-vous sûr de vouloir supprimer :name ? Cette action est irréversible.',
    ],

    // Roles
    'roles' => [
        'admin' => 'Administrateur',
        'coordinator' => 'Coordinateur',
        'verifier' => 'Vérificateur',
        'instructor' => 'Formateur',
        'attendee' => 'Stagiaire',
    ],

    // Status
    'status' => [
        'active' => 'Actif',
        'inactive' => 'Inactif',
        'completed' => 'Terminé',
        'withdrawn' => 'Retiré',
        'present' => 'Présent',
        'late' => 'Retard',
        'absent' => 'Absent',
        'excused' => 'Excusé',
        'pending' => 'En attente',
    ],

    // Sessions & Slots
    'sessions' => [
        'title' => 'Sessions du jour',
        'today' => 'Sessions du jour',
        'date' => 'Date',
        'slot' => 'Créneau',
        'session' => 'Session',
        'am' => 'Matin',
        'pm' => 'Après-midi',
        'state' => 'État',
        'scheduled' => 'Planifié',
        'open' => 'Ouvert',
        'closed' => 'Fermé',
        'locked' => 'Verrouillé',
        'open_slot' => 'Ouvrir le créneau',
        'close_slot' => 'Fermer le créneau',
        'lock_slot' => 'Verrouiller',
        'show_qr' => 'Afficher QR',
        'refresh_qr' => 'Actualiser QR',
        'check_ins' => 'pointages',
        'no_sessions_today' => 'Aucune session prévue aujourd\'hui',
        'check_back_later' => 'Revenez plus tard ou contactez un administrateur.',
        'state_scheduled' => 'Planifié',
        'state_open' => 'Ouvert',
        'state_closed' => 'Fermé',
        'state_locked' => 'Verrouillé',
    ],

    // Enrollments
    'enrollments' => [
        'title' => 'Inscriptions',
        'enrolled' => 'Inscrit le',
        'none' => 'Aucune inscription',
    ],

    // Check-ins
    'check_ins' => [
        'recent' => 'Pointages récents',
        'none' => 'Aucun pointage enregistré',
    ],

    // Stats
    'stats' => [
        'attendance' => 'Statistiques de présence',
        'rate' => 'Taux de présence',
    ],

    // Attendance
    'attendance' => [
        'title' => 'Présences',
        'status' => 'Statut',
        'present' => 'Présent',
        'late' => 'Retard',
        'absent' => 'Absent',
        'excused' => 'Excusé',
        'pending' => 'En attente',
        'checked_in_at' => 'Pointé à',
        'manual_entry' => 'Saisie manuelle',
        'manual_checkin' => 'Pointage manuel',
        'history' => 'Historique des présences',
    ],

    // Check-in
    'checkin' => [
        'title' => 'Pointage',
        'scan_qr' => 'Scannez le QR pour pointer',
        'enter_pin' => 'Entrez votre code PIN à 4 chiffres',
        'verify' => 'Vérifier',
        'success' => 'Pointage réussi !',
        'already_checked_in' => 'Vous avez déjà pointé',
        'error_invalid_qr' => 'Ce QR code est invalide ou la session est fermée.',
        'error_not_enrolled' => 'Vous n\'êtes pas inscrit à cette formation.',
        'forgot_pin' => 'PIN oublié ? Contactez votre formateur.',
    ],

    // Settings
    'settings' => [
        'title' => 'Paramètres',
        'system_overview' => 'Aperçu du système',
        'organization_settings' => 'Paramètres organisation',
        'quick_actions' => 'Actions rapides',
        'language' => 'Langue',
        'english' => 'English',
        'french' => 'Français',
    ],

    // Days of week
    'days' => [
        'monday' => 'Lundi',
        'tuesday' => 'Mardi',
        'wednesday' => 'Mercredi',
        'thursday' => 'Jeudi',
        'friday' => 'Vendredi',
        'saturday' => 'Samedi',
        'sunday' => 'Dimanche',
    ],

    // Audit Log
    'audit' => [
        'title' => 'Journal d\'activité',
        'action' => 'Action',
        'user' => 'Utilisateur',
        'subject' => 'Sujet',
        'date' => 'Date',
        'details' => 'Détails',
    ],
];
