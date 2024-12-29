import ApplicationsSearchBottomSheet from '../../components/modals/applications-search-bottom-sheet/applications-search-bottom-sheet';

const ActiveApplications = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.container}>
      <ApplicationsSearchBottomSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        applications={applications}
      />
    </div>
  );
}; 